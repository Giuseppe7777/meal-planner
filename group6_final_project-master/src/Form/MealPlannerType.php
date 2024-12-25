<?php

namespace App\Form;

use App\Entity\MealPlanner;
use App\Entity\Recipe;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MealPlannerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $approvedRecipes = $options['approved_recipes'];
        $builder

            ->add('chosen_date', DateTimeType::class)
            

            ->add('meal_chosen', EntityType::class, [
                'class' => Recipe::class,
                'choices' => $approvedRecipes,
                'multiple' => true,
                'expanded' => true,
                'choice_label' => 'name',
                'choice_value' => 'id',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => MealPlanner::class,
            'approved_recipes' => []
        ]);
    }
}
