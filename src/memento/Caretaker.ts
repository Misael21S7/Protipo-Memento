/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrescriptionMemento } from "./ConcreteMemento";

/**
 * Caretaker
 * Based on user's C# History class.
 */
export class TreatmentHistory {
  private readonly _mementos: PrescriptionMemento[] = [];

  public AddMemento(memento: PrescriptionMemento): void {
    this._mementos.push(memento);
  }

  public GetMemento(index: number): PrescriptionMemento {
    return this._mementos[index];
  }

  public GetAllMementos(): PrescriptionMemento[] {
    return [...this._mementos];
  }

  public PopMemento(): PrescriptionMemento | undefined {
    return this._mementos.pop();
  }

  public get Count(): number {
    return this._mementos.length;
  }
}
