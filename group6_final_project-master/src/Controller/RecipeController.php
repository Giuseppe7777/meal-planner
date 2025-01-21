<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Form\RecipeType;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\FileUploader;

#[Route('/home/admin/recipe', name: 'admin_')]
final class RecipeController extends AbstractController
{
    #[Route('/',name: 'app_recipe_index', methods: ['GET'])]
    public function index(RecipeRepository $recipeRepository): Response
    {
        return $this->render('recipe/index.html.twig', [
            'recipes' => $recipeRepository->findAll(),
        ]);
    }

    #[Route('/pending', name: 'app_pending', methods: ['GET'])]
    public function pending(RecipeRepository $recipeRepository): Response
    {
        return $this->render('recipe/pending.html.twig', [
            'recipes' => $recipeRepository->findAll(),
        ]);
    }

    #[Route('/approve/{id}', name: 'app_approve', methods: ['GET', 'POST'])]
    public function approve(Recipe $recipe, EntityManagerInterface $em): Response
    {
        $recipe->setStatus(1);
        $em->persist($recipe);
        $em->flush();
        return $this->redirectToRoute('admin_app_recipe_index', [], Response::HTTP_SEE_OTHER);
    }

    // #[Route('/new', name: 'app_recipe_new', methods: ['GET', 'POST'])]
    // public function new(Request $request, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    // {
    //     $recipe = new Recipe();
    //     $form = $this->createForm(RecipeType::class, $recipe);
    //     $form->handleRequest($request);
    //     $user = $this->getUser();
    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $imageFile = $form->get('photo')->getData();
    //         if ($imageFile) {
    //         $imageFileName = $fileUploader->upload($imageFile);
    //         $recipe->setPhoto($imageFileName);
    //         }else{
    //             $recipe->setPhoto("recipe.jpg");
    //         }
    //         $recipe->setAuthor($user);
    //         $recipe->setStatus(True);
    //         $entityManager->persist($recipe);
    //         $entityManager->flush();

    //         return $this->redirectToRoute('admin_app_recipe_index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     return $this->render('recipe/new.html.twig', [
    //         'recipe' => $recipe,
    //         'form' => $form,
    //     ]);
    // }

    #[Route('/new', name: 'app_recipe_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    {
        $recipe = new Recipe();
        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);
        $user = $this->getUser();
        
        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('photo')->getData();
            if ($imageFile) {
            $imageFileName = $fileUploader->upload($imageFile);
            $recipe->setPhoto($imageFileName);
            }else{
                $recipe->setPhoto("recipe.jpg");
            }
            $recipe->setAuthor($user);
            $recipe->setStatus(True);
            $ingredientsJson = $form->get('ingredients')->getData();
            $recipe->setIngredients($ingredientsJson);
            $entityManager->persist($recipe);
            $entityManager->flush();

            $this->addFlash('success', 'Recipe has been added.');
            
            return $this->redirectToRoute('admin_app_recipe_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('recipe/new.html.twig', [
            'recipe' => $recipe,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_recipe_show', methods: ['GET'])]
    public function show(Recipe $recipe): Response
    {
         /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $availableTypes = Recipe::getAvailableTypes();

        return $this->render('recipe/show.html.twig', [
            'recipe' => $recipe,
            'userId' => $user->getId(),
            'availableTypes' => $availableTypes,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_recipe_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Recipe $recipe, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    {
        
        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        // ***************************
            /** @var \App\Entity\User $user */
            $user = $this->getUser(); // you get user from system
        //**************************** */

        if ($form->isSubmitted() && $form->isValid()) { 
            $imageFile = $form->get('photo')->getData();
            if ($imageFile) {
                if($recipe->getPhoto() != "recipe.jpg") {
                    unlink($this->getParameter('photo_directory') . "/" . $recipe->getPhoto());
                }
                $imageFileName = $fileUploader->upload($imageFile);
                $recipe->setPhoto($imageFileName);
            }

            elseif($recipe->getPhoto() != "recipe.jpg") {
                unlink($this->getParameter('photo_directory') . "/" . $recipe->getPhoto());

                $recipe->setPhoto('recipe.jpg');
            }

            $ingredientsInput = $form->get('ingredients')->getData();
            $recipe->setIngredients($ingredientsInput);

            $entityManager->flush();

            $this->addFlash('success', 'Recipe has been updated.');

            return $this->redirectToRoute('app_recipe_index', [], Response::HTTP_SEE_OTHER);
        }

         /** @var \App\Entity\User $user */
        return $this->render('recipe/edit.html.twig', [
            'recipe' => $recipe,
            'form' => $form,

            // *********************************************************
            'userId' => $user->getId(), // you sent userId to template
            // *********************************************************
        ]);
    }


    #[Route('/{id}', name: 'app_recipe_delete', methods: ['POST'])]
    public function delete(Request $request, Recipe $recipe, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$recipe->getId(), $request->getPayload()->getString('_token'))) {

            if($recipe->getPhoto() != "recipe.jpg"){
                unlink($this->getParameter('photo_directory') . "/" . $recipe->getPhoto());
            }
            $entityManager->remove($recipe);
            $entityManager->flush();
        }
    
        return $this->redirectToRoute('admin_app_pending', [], Response::HTTP_SEE_OTHER);
    }
}