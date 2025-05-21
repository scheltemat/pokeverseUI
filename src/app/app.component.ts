import { Component, OnInit } from "@angular/core";
import { PokemonService, Pokemon } from "./services/pokemon.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { PokemonCardComponent } from "./components/pokemon-card/pokemon-card.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, PokemonCardComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  squad: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.fetchPokemonList().subscribe({
      next: (pokemon) => (this.pokemonList = pokemon),
      error: (err) => console.error("Error loading Pokémon:", err),
    });

    this.pokemonService.squad$.subscribe((squad) => (this.squad = squad));
  }

  addToSquad(pokemon: Pokemon): void {
    this.pokemonService.addToSquad(pokemon);
  }

  removeFromSquad(pokemon: Pokemon): void {
    this.pokemonService.removeFromSquad(pokemon);
  }

  isInSquad(pokemon: Pokemon): boolean {
    return this.pokemonService.isInSquad(pokemon);
  }

  get canBattle(): boolean {
    return this.pokemonService.canBattle();
  }

  handleBattle(): void {
    alert("Battle started!");
  }
}
