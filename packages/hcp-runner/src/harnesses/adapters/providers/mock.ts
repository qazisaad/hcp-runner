import type { ProviderInstanceConfig } from "../../../config/index.js";
import type { ProviderDriverStatus } from "../../../host/provider-registry.js";
import type {
  HarnessAdapter,
  HarnessAdapterCancelInput,
  HarnessAdapterEvent,
  HarnessAdapterSession,
  HarnessAdapterStartInput,
  HarnessAdapterTurnInput,
} from "../types.js";
import { normalizeProviderModels } from "./shared.js";

export class MockHarnessAdapter implements HarnessAdapter {
  readonly driverKind = "mock";

  async probe(provider: ProviderInstanceConfig): Promise<ProviderDriverStatus> {
    return {
      provider_instance_id: provider.id,
      driver_kind: provider.driver_kind,
      installed: true,
      available: true,
      status: "ready",
      version: "0.0.0-mock",
      models: normalizeProviderModels(provider.models),
    };
  }

  async validateStart(): Promise<void> {
    return;
  }

  async startSession(input: HarnessAdapterStartInput): Promise<HarnessAdapterSession> {
    return {
      adapter_session_id: input.payload.session_id,
    };
  }

  async sendTurn(input: HarnessAdapterTurnInput): Promise<HarnessAdapterEvent[]> {
    return [
      {
        event_type: "turn.started",
        turn_id: input.payload.turn_id,
        data: {
          provider_instance_id: input.provider.id,
          input_length: input.payload.input.length,
          ...(input.payload.model_selection ? { model_selection: input.payload.model_selection } : {}),
        },
      },
      {
        event_type: "turn.completed",
        turn_id: input.payload.turn_id,
        data: {
          status: "accepted",
          final_output: {
            final_text: "",
          },
        },
      },
    ];
  }

  async cancelTurn(input: HarnessAdapterCancelInput): Promise<HarnessAdapterEvent[]> {
    return [
      {
        event_type: "turn.cancelled",
        turn_id: input.turnId,
        data: {
          status: "cancelled",
          final_output: {
            exit_reason: "cancel_requested",
          },
        },
      },
    ];
  }

  async stopSession(): Promise<HarnessAdapterEvent[]> {
    return [];
  }
}
