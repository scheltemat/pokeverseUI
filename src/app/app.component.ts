import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { forkJoin, switchMap, map } from "rxjs";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  base_experience: number;
  moves: { move: { name: string; url: string } }[];
  sprites: { front_default: string }; // Add sprites to get the image URL
}

interface MoveDetails {
  pp: number;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  pokemonList: {
    name: string;
    level: number;
    moveName: string;
    movePP: number;
    imageUrl: string; // Add imageUrl field for the Pokémon's image
  }[] = [];

  constructor(private http: HttpClient) {
    this.fetchPokemonList();
  }

  fetchPokemonList() {
    this.http
      .get<{ results: Pokemon[] }>(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      )
      .pipe(
        switchMap((res) => {
          const detailRequests = res.results.map((pokemon) =>
            this.http.get<PokemonDetails>(pokemon.url).pipe(
              switchMap((details) => {
                const firstMove = details.moves[0];
                if (!firstMove) {
                  return [null]; // Skip if no move
                }
                return this.http.get<MoveDetails>(firstMove.move.url).pipe(
                  map((moveDetails) => ({
                    name: pokemon.name,
                    level: details.base_experience,
                    moveName: firstMove.move.name,
                    movePP: moveDetails.pp,
                    imageUrl: details.sprites.front_default, // Capture the image URL
                  }))
                );
              })
            )
          );
          return forkJoin(detailRequests);
        })
      )
      .subscribe(
        (pokemonData) => {
          this.pokemonList = pokemonData.filter(
            (
              p
            ): p is {
              name: string;
              level: number;
              moveName: string;
              movePP: number;
              imageUrl: string; // Ensure the imageUrl is available
            } => p !== null
          );
          // Filter out any null entries
        },
        (error) => console.error("Error loading Pokémon:", error)
      );
  }
}
