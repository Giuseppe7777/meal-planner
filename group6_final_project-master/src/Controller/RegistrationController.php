<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Service\UserFileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;


class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager, SessionInterface $session, CsrfTokenManagerInterface $csrfTokenManager, UserFileUploader $userFileUploader): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $form->get('plainPassword')->getData();
        
            // encode the plain password
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));
            $user->setBlocked(False);

            // $imageFile = $form->get('photo')->getData();
            // if ($imageFile) {
            //     dd('Image file exists: ' .$imageFile);
            // $imageFileName = $userFileUploader->upload($imageFile);
            // $user->setPhoto($imageFileName);
            // }else{
            //     dd('else');
            //     $user->setPhoto("user.jpg");
            // }

            $entityManager->persist($user);
            $entityManager->flush();

            // do anything else you need here, like send an email

            return $this->redirectToRoute('app_login');
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form,
        ]);
    }

    #[Route('/check-email', name: 'app_check_email')]
    public function checkEmail(Request $request, UserRepository $userRepository) : JsonResponse
    {
        // Отримуємо email з запиту
        $email = $request->query->get('email');

        // Перевіряємо, чи є користувач із таким email
        $exists = (bool) $userRepository->findOneBy(['email' => $email]);

        // Повертаємо результат у форматі JSON
        return $this->json(['exists' => $exists]);
    }

}
