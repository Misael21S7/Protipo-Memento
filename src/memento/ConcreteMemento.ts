/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TreatmentState } from "./interfaces";

/**
 * Memento
 * Based on user's C# EditorMemento class.
 */
export class PrescriptionMemento {
  private readonly _savedState: TreatmentState;
  private readonly _date: string;

  constructor(state: TreatmentState) {
    this._savedState = { ...state }; // Immutable copy
    this._date = new Date().toLocaleString();
  }

  public get SavedState(): TreatmentState {
    return this._savedState;
  }

  public get Date(): string {
    return this._date;
  }
}
