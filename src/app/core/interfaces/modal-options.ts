import { NotificationType } from "../types/types";

export interface ModalOptions {
  type: NotificationType,
  title: string,
  body: string,
  isDecision: boolean
}
