import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgToolsModule } from '@myrmidon/ng-tools';

import { ArrayIntersectPipe } from '../../pipes/array-intersect.pipe';

export interface TextBlock {
  id: string;
  text: string;
  decoration?: string;
  tip?: string;
  htmlDecoration?: boolean;
  layerIds?: string[];
}

export interface TextBlockEventArgs {
  decoration?: boolean;
  block: TextBlock;
}

@Component({
  standalone: true,
  selector: 'cadmus-text-block-view',
  templateUrl: './text-block-view.component.html',
  styleUrls: ['./text-block-view.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgToolsModule,
    ArrayIntersectPipe,
  ],
})
export class TextBlockViewComponent implements OnInit {
  private _blocks: TextBlock[];

  @Input()
  public selectedIds: string[] | undefined;

  @Input()
  public get blocks(): TextBlock[] {
    return this._blocks;
  }
  public set blocks(value: TextBlock[]) {
    if (this._blocks !== value) {
      this._blocks = value;
    }
  }

  @Output()
  public blockClick: EventEmitter<TextBlockEventArgs>;

  constructor() {
    this._blocks = [];
    this.blockClick = new EventEmitter<TextBlockEventArgs>();
  }

  ngOnInit(): void {}

  public getBlockId(index: number, block: TextBlock): any {
    return block.id;
  }

  public onBlockClick(block: TextBlock, decoration: boolean): void {
    this.blockClick.emit({ decoration: decoration, block: block });
  }
}
