<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class StaticController extends AbstractController
{
    #[Route('/', name: 'app_static')]
    public function index(): Response
    {
        return $this->render('static/index.html.twig', [
            'is_authenticated' => $this->isGranted('IS_AUTHENTICATED_FULLY')
        ]);
    }
}

