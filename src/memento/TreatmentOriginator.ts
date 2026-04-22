/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TreatmentState } from "./interfaces";
import { PrescriptionMemento } from "./ConcreteMemento";

/**
 * Originator
 * Based on user's C# Editor class.
 */
export class PrescriptionEditor {
  private _state: TreatmentState;

  constructor(initialState: TreatmentState) {
    this._state = initialState;
  }

  public get State(): TreatmentState {
    return this._state;
  }

  public set State(value: TreatmentState) {
    this._state = { ...value };
  }

  public CreateMemento(): PrescriptionMemento {
    return new PrescriptionMemento(this._state);
  }

  public RestoreMemento(memento: PrescriptionMemento): void {
    this._state = memento.SavedState;
  }
}
