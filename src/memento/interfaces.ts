/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TreatmentState {
  researchSubject: string;
  clearanceLevel: number;
  incubationPeriod: string;
  viralStrain: string;
  sectorLocation: string;
  supervisorId: string;
  notes?: string;
}

export interface Memento {
  getName(): string;
  getDate(): string;
  getState(): TreatmentState;
}
