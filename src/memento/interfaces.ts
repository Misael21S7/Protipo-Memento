/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TreatmentState {
  medication: string;
  schedule: number;
  treatmentDuration: string;
  dosage: string;
  administrationRoute: string;
  attendingPhysician: string;
  notes?: string;
}

export interface Memento {
  getName(): string;
  getDate(): string;
  getState(): TreatmentState;
}
