import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-pokemon-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pokemon-card.component.html",
  styleUrls: ["./pokemon-card.component.css"],
})
export class PokemonCardComponent {
  @Input() name!: string;
  @Input() imageUrl!: string;
  @Input() level!: number;
  @Input() moveName!: string;
  @Input() movePP!: number;
  @Input() isInSquad: boolean = false;

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  onClick() {
    this.isInSquad ? this.remove.emit() : this.add.emit();
  }
}
