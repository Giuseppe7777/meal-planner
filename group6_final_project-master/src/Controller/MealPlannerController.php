<?php

namespace App\Controller;

use App\Entity\MealPlanner;
use App\Entity\Recipe;
use App\Form\MealPlannerType;
use App\Repository\MealPlannerRepository;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use function PHPSTORM_META\type;

#[Route('/meal/planner')]
final class MealPlannerController extends AbstractController
{
    #[Route(name: 'app_meal_planner_index', methods: ['GET'])]
    public function index(MealPlannerRepository $mealPlannerRepository): Response
    {
         /** @var \App\Entity\User $user */
        $user = $this->getUser();
        return $this->render('meal_planner/index.html.twig', [
            'meal_planners' => $mealPlannerRepository->findBy(['user' => $user]),
            'userId'=>$user->getId(),
        ]);
    }




    #[Route('/new', name: 'app_meal_planner_new', methods: ['GET', 'POST'])]
    public function new(RecipeRepository $recipeRepository,Request $request, EntityManagerInterface $entityManager): Response
    {
        $type = $request->query->get('type');
        $maxCaloriesInput = $request->query->get('max_calories'); 
        $maxCalories = is_numeric($maxCaloriesInput) ? (int) $maxCaloriesInput : null; 

        $mealPlanner = new MealPlanner();
        // $form = $this->createForm(MealPlannerType::class, $mealPlanner);
        

        $user=$this->getUser();
        if (!$type && !$maxCalories) {
            $approvedRecipes = $recipeRepository->findBy(["status"=>"1"]);
        } else {            
            $approvedRecipes = $recipeRepository->findByFilters($type, $maxCalories);
        }

           // approved recipies from current user in session
            if ($user) {
            if (!$type && !$maxCalories) {
                $userRecipes = $recipeRepository->findBy([
                    'status' => true,
                    'author' => $user,
                ]);
            } else {
                $userRecipes = $recipeRepository->findByFiltersAndUser($type, $maxCalories, $user);
            }
        $mealPlanner = new MealPlanner();
        $form = $this->createForm(MealPlannerType::class, $mealPlanner, [
            'approved_recipes' => $approvedRecipes,
        ]);
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $now = new \DateTime("now");
            $mealPlanner->setUpdateDate($now);
            $mealPlanner->setUser($user);
            $entityManager->persist($mealPlanner);
            $entityManager->flush();

            return $this->redirectToRoute('app_meal_planner_index', [], Response::HTTP_SEE_OTHER);
        }
    }

        return $this->render('meal_planner/new.html.twig', [
            'meal_planner' => $mealPlanner,
            'form' => $form,
            'type' => $type
        ]);
    }

    #[Route('/{id}', name: 'app_meal_planner_show', methods: ['GET'])]
    public function show(MealPlanner $mealPlanner): Response
    {
        return $this->render('meal_planner/show.html.twig', [
            'meal_planner' => $mealPlanner,
        ]);
    }

// =========================================================

#[Route('/{id}/edit', name: 'app_meal_planner_edit', methods: ['GET', 'POST'])]
public function edit(
    Request $request,
    MealPlanner $mealPlanner,
    EntityManagerInterface $entityManager,
    RecipeRepository $recipeRepository
): Response {
    $type = $request->query->get('type'); 
    $maxCaloriesInput = $request->query->get('max_calories'); 
    $maxCalories = is_numeric($maxCaloriesInput) ? (int) $maxCaloriesInput : null; 

    $user = $this->getUser(); 

    if (!$type && !$maxCalories) {
        $approvedRecipes = $recipeRepository->findBy(['status' => true]);
    } else {
        $approvedRecipes = $recipeRepository->findByFilters($type, $maxCalories);
    }

    $userRecipes = [];
    if ($user) {
        if (!$type && !$maxCalories) {
            $userRecipes = $recipeRepository->findBy([
                'status' => true,
                'author' => $user,
            ]);
        } else {
            $userRecipes = $recipeRepository->findByFiltersAndUser($type, $maxCalories, $user);
        }
    }

    $form = $this->createForm(MealPlannerType::class, $mealPlanner, [
        'approved_recipes' => $approvedRecipes,
    ]);

    $form->remove('meal_chosen');

    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $chosenRecipes = $request->request->all('meal_chosen');
        $mealPlanner->getMealChosen()->clear();

        foreach ($chosenRecipes as $recipeId) {
            $recipe = $recipeRepository->find($recipeId);
            if ($recipe) {
                $mealPlanner->addMealChosen($recipe);
            }
        }
        $entityManager->flush();

        return $this->redirectToRoute('app_meal_planner_index', [], Response::HTTP_SEE_OTHER);
    }

    return $this->render('meal_planner/edit.html.twig', [
        'meal_planner' => $mealPlanner,
        'form' => $form->createView(),
        'recipes' => $approvedRecipes, 
        'type' => $type,
        'max_calories' => $maxCalories, 
    ]);
}


// ====================================================



    #[Route('/{id}', name: 'app_meal_planner_delete', methods: ['POST'])]
    public function delete(Request $request, MealPlanner $mealPlanner, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$mealPlanner->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($mealPlanner);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_meal_planner_index', [], Response::HTTP_SEE_OTHER);
    }

}
