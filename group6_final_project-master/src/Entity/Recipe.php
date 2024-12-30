<?php

namespace App\Entity;

use App\Repository\RecipeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RecipeRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Recipe
{
// =========================================
    public const TYPES = [        
        'Vegan' => 'Vegan',
        'Vegetarian' => 'Vegetarian',
        'Pescatarian' => 'Pescatarian',
        'Carnivore' => 'Carnivore',
        'Low-Carb' => 'Low-carb',
        'Paleo' => 'Paleo'
    ];
// ==========================================

    #[ORM\Id] 
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $ingredients = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photo = null;

    #[ORM\Column]
    private ?int $cooking_time = null;

    #[ORM\Column]
    private ?int $preparation_time = null;

    #[ORM\Column]
    private ?int $calories = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $link = null;

    #[ORM\Column(type: Types::STRING, length: 20, nullable: true, enumType: false)]
    private ?string $type = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $date_added = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $date_updated = null;


    // ==================================


    public static function getAvailableTypes(): array
    {
        return self::TYPES;
    }


    // ==================================

    #[ORM\PrePersist]
    public function updateDateAdded():void {
        $this->date_added = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function updateDateUpdated():void {
        $this->date_updated = new \DateTimeImmutable();
    }

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    #[ORM\Column(nullable: true)]
    private ?bool $status = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getIngredients(): ?string
    {
        return $this->ingredients;
    }

    public function setIngredients(string $ingredients): static
    {
        $this->ingredients = $ingredients;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getCookingTime(): ?int
    {
        return $this->cooking_time;
    }

    public function setCookingTime(int $cooking_time): static
    {
        $this->cooking_time = $cooking_time;

        return $this;
    }

    public function getPreparationTime(): ?int
    {
        return $this->preparation_time;
    }

    public function setPreparationTime(int $preparation_time): static
    {
        $this->preparation_time = $preparation_time;

        return $this;
    }

    public function getCalories(): ?int
    {
        return $this->calories;
    }

    public function setCalories(int $calories): static
    {
        $this->calories = $calories;

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getDateAdded(): ?\DateTimeImmutable
    {
        return $this->date_added;
    }

    public function setDateAdded(?\DateTimeImmutable $date_added): static
    {
        $this->date_added = $date_added;

        return $this;
    }

    public function getDateUpdated(): ?\DateTimeImmutable
    {
        return $this->date_updated;
    }

    public function setDateUpdated(?\DateTimeImmutable $date_updated): static
    {
        $this->date_updated = $date_updated;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function isStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(?bool $status): static
    {
        $this->status = $status;

        return $this;
    }
}
