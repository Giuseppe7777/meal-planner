<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Image;
use Vich\UploaderBundle\Form\Type\VichFileType;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // ->add('email')
            // ->add('password')
            ->add('first_name', TextType::class, array(
                'attr' => ['pattern' => '[a-zA-Z0-9\s.,\-\(\)]*']
            ))
            ->add('last_name', TextType::class, array(
                'attr' => ['pattern' => '[a-zA-Z0-9\s.,\-\(\)]*']
            ))
            ->add('imageFile', VichFileType::class, [
                'required' => false,
                'allow_delete' => true,
                'delete_label' => 'Remove file',
                'download_uri' => false,
                'download_label' => 'download file',
                'asset_helper' => true,
                'label' => 'Profile Picture',
                'label_attr' => ["class" => "form-label"],
                'constraints' => [
                new Image([
                    'maxSize' => '2048k',
                    'mimeTypes' => [
                        'image/png',
                        'image/jpg',
                        'image/jpeg',
                    ],
                    'mimeTypesMessage' => 'Please upload a valid image (jpeg, png, gif, jpg)',
                    'maxSizeMessage' => 'The file is too large ({{ size }} {{ suffix }}). Allowed maximum size is {{ limit }} {{ suffix }}',
        
                    ])
                ],
            ])
            ->add('phone_number', TelType::class, [
                'required' => false,
                'attr' => [
                    'pattern' => '^[0-9\-\+\s\(\)]{6,20}$',
                    'placeholder' => '+XX XXX XXX XXX',
                    'class' => 'form-control'
                ]])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
