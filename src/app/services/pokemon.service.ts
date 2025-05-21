import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject } from "rxjs";
import { switchMap, map } from "rxjs/operators";

export interface Pokemon {
  name: string;
  level: number;
  moveName: string;
  movePP: number;
  imageUrl: string;
}

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private squadSubject = new BehaviorSubject<Pokemon[]>([]);
  squad$ = this.squadSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchPokemonList(): Observable<Pokemon[]> {
    return this.http
      .get<{ results: { name: string; url: string }[] }>(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      )
      .pipe(
        switchMap((res) => {
          const detailRequests = res.results.map((pokemon) =>
            this.http.get<any>(pokemon.url).pipe(
              switchMap((details) => {
                const firstMove = details.moves[0];
                if (!firstMove) {
                  return [null];
                }
                return this.http.get<any>(firstMove.move.url).pipe(
                  map((moveDetails) => ({
                    name: pokemon.name,
                    level: details.base_experience,
                    moveName: firstMove.move.name,
                    movePP: moveDetails.pp,
                    imageUrl: details.sprites.front_default,
                  }))
                );
              })
            )
          );
          return forkJoin(detailRequests);
        }),
        map((pokemonData) =>
          pokemonData.filter((p): p is Pokemon => p !== null)
        )
      );
  }

  getSquad(): Pokemon[] {
    return this.squadSubject.value;
  }

  addToSquad(pokemon: Pokemon): void {
    const currentSquad = this.squadSubject.value;
    if (
      currentSquad.length >= 6 ||
      currentSquad.some((p) => p.name === pokemon.name)
    )
      return;
    this.squadSubject.next([...currentSquad, pokemon]);
  }

  removeFromSquad(pokemon: Pokemon): void {
    const updatedSquad = this.squadSubject.value.filter(
      (p) => p.name !== pokemon.name
    );
    this.squadSubject.next(updatedSquad);
  }

  isInSquad(pokemon: Pokemon): boolean {
    return this.squadSubject.value.some((p) => p.name === pokemon.name);
  }

  canBattle(): boolean {
    return this.squadSubject.value.length >= 2;
  }
}
