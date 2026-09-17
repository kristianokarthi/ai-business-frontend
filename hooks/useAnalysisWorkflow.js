"use client";

import { useCallback, useRef, useState } from "react";

import { runBusinessFundamentals } from "@/lib/Businessfundamentals";
import { runCustomerReputation } from "@/lib/Customerreputation";
import { runFactFinder } from "@/lib/Factfinder";
import { runMarketCompetitor } from "@/lib/Marketcompetitor";


export const AGENT_DEFINITIONS = [
  {
    id: "factFinder",
    label: "Agent 1",
    title: "Company evidence",
    activity: "Collecting and verifying company information",
  },
  {
    id: "businessFundamentals",
    label: "Agent 2",
    title: "Business fundamentals",
    activity: "Understanding the business model",
  },
  {
    id: "marketCompetitor",
    label: "Agent 3",
    title: "Market and competitors",
    activity: "Reviewing the market and competitors",
  },
  {
    id: "customerReputation",
    label: "Agent 4",
    title: "Customer and reputation",
    activity: "Collecting public signals and analysing customer reputation",
  },
];


function emptyAgent() {
  return {
    status: "pending",
    result: null,
    usage: null,
    collection: null,
    error: null,
    startedAt: null,
    finishedAt: null,
  };
}


function createInitialWorkflow() {
  return {
    status: "idle",
    failedAgent: null,
    startedAt: null,
    finishedAt: null,
    agents: Object.fromEntries(
      AGENT_DEFINITIONS.map(({ id }) => [id, emptyAgent()])
    ),
  };
}


function readableError(error) {
  return {
    message: error?.message || "The agent could not complete its work.",
    code: error?.code || "request_failed",
    status: error?.status || null,
    retryAfter: error?.retryAfter || null,
  };
}


export default function useAnalysisWorkflow() {
  const [workflow, setWorkflow] = useState(createInitialWorkflow);
  const resultsRef = useRef({});
  const formRef = useRef(null);

  const updateAgent = useCallback((agentId, patch) => {
    setWorkflow((current) => ({
      ...current,
      agents: {
        ...current.agents,
        [agentId]: {
          ...current.agents[agentId],
          ...patch,
        },
      },
    }));
  }, []);

  const completeWorkflow = useCallback(() => {
    const finishedAt = Date.now();
    setWorkflow((current) => ({
      ...current,
      status: "completed",
      failedAgent: null,
      finishedAt,
    }));
  }, []);

  const runCustomerAgent = useCallback(async (form) => {
    updateAgent("customerReputation", {
      status: "running",
      result: null,
      usage: null,
      collection: null,
      error: null,
      startedAt: Date.now(),
      finishedAt: null,
    });

    try {
      const response = await runCustomerReputation({
        companyName: form.companyName,
        purpose: form.purpose,
        followUpAnswers: form.followUpAnswers,
      });
      resultsRef.current.customerReputation = response;
      updateAgent("customerReputation", {
        status: response.result?.status === "insufficient_data"
          ? "insufficient_data"
          : "completed",
        result: response.result,
        usage: response.usage,
        collection: response.collection,
        finishedAt: Date.now(),
      });
      completeWorkflow();
    } catch (error) {
      if (error?.code === "insufficient_public_signals") {
        updateAgent("customerReputation", {
          status: "insufficient_data",
          error: readableError(error),
          finishedAt: Date.now(),
        });
        completeWorkflow();
        return;
      }

      updateAgent("customerReputation", {
        status: "failed",
        error: readableError(error),
        finishedAt: Date.now(),
      });
      setWorkflow((current) => ({
        ...current,
        status: "failed",
        failedAgent: "customerReputation",
        finishedAt: Date.now(),
      }));
    }
  }, [completeWorkflow, updateAgent]);

  const runMarketAgent = useCallback(async (
    form,
    factFinderResponse,
    businessResponse
  ) => {
    updateAgent("marketCompetitor", {
      status: "running",
      error: null,
      startedAt: Date.now(),
      finishedAt: null,
    });

    try {
      const response = await runMarketCompetitor({
        purpose: form.purpose,
        followUpAnswers: form.followUpAnswers,
        companyEvidence: factFinderResponse.result,
        businessFundamentals: businessResponse.result,
      });
      resultsRef.current.marketCompetitor = response;
      updateAgent("marketCompetitor", {
        status: response.result?.status === "insufficient_data"
          ? "insufficient_data"
          : "completed",
        result: response.result,
        usage: response.usage,
        collection: response.collection,
        finishedAt: Date.now(),
      });
      await runCustomerAgent(form);
    } catch (error) {
      updateAgent("marketCompetitor", {
        status: "failed",
        error: readableError(error),
        finishedAt: Date.now(),
      });
      setWorkflow((current) => ({
        ...current,
        status: "failed",
        failedAgent: "marketCompetitor",
        finishedAt: Date.now(),
      }));
    }
  }, [runCustomerAgent, updateAgent]);

  const runBusinessAgent = useCallback(async (form, factFinderResponse) => {
    updateAgent("businessFundamentals", {
      status: "running",
      error: null,
      startedAt: Date.now(),
      finishedAt: null,
    });

    try {
      const response = await runBusinessFundamentals({
        purpose: form.purpose,
        followUpAnswers: form.followUpAnswers,
        evidencePack: factFinderResponse.result,
      });
      resultsRef.current.businessFundamentals = response;
      updateAgent("businessFundamentals", {
        status: "completed",
        result: response.result,
        usage: response.usage,
        finishedAt: Date.now(),
      });
      await runMarketAgent(form, factFinderResponse, response);
    } catch (error) {
      updateAgent("businessFundamentals", {
        status: "failed",
        error: readableError(error),
        finishedAt: Date.now(),
      });
      setWorkflow((current) => ({
        ...current,
        status: "failed",
        failedAgent: "businessFundamentals",
        finishedAt: Date.now(),
      }));
    }
  }, [runMarketAgent, updateAgent]);

  const runFactFinderAgent = useCallback(async (form) => {
    updateAgent("factFinder", {
      status: "running",
      error: null,
      startedAt: Date.now(),
      finishedAt: null,
    });

    try {
      const response = await runFactFinder({
        companyName: form.companyName,
        officialWebsite: form.website,
        purpose: form.purpose,
        followUpAnswers: form.followUpAnswers,
      });
      resultsRef.current.factFinder = response;
      updateAgent("factFinder", {
        status: "completed",
        result: response.result,
        usage: response.usage,
        finishedAt: Date.now(),
      });
      await runBusinessAgent(form, response);
    } catch (error) {
      updateAgent("factFinder", {
        status: "failed",
        error: readableError(error),
        finishedAt: Date.now(),
      });
      setWorkflow((current) => ({
        ...current,
        status: "failed",
        failedAgent: "factFinder",
        finishedAt: Date.now(),
      }));
    }
  }, [runBusinessAgent, updateAgent]);

  const run = useCallback(async (form) => {
    const startedAt = Date.now();
    formRef.current = form;
    resultsRef.current = {};
    setWorkflow({
      ...createInitialWorkflow(),
      status: "running",
      startedAt,
    });
    await runFactFinderAgent(form);
  }, [runFactFinderAgent]);

  const retryFailed = useCallback(async () => {
    const form = formRef.current;
    if (!form) return;

    setWorkflow((current) => ({
      ...current,
      status: "running",
      failedAgent: null,
      finishedAt: null,
    }));

    if (workflow.failedAgent === "businessFundamentals" && resultsRef.current.factFinder) {
      await runBusinessAgent(form, resultsRef.current.factFinder);
      return;
    }

    if (
      workflow.failedAgent === "marketCompetitor" &&
      resultsRef.current.factFinder &&
      resultsRef.current.businessFundamentals
    ) {
      await runMarketAgent(
        form,
        resultsRef.current.factFinder,
        resultsRef.current.businessFundamentals
      );
      return;
    }

    if (workflow.failedAgent === "customerReputation") {
      await runCustomerAgent(form);
      return;
    }

    await runFactFinderAgent(form);
  }, [
    runBusinessAgent,
    runFactFinderAgent,
    runMarketAgent,
    runCustomerAgent,
    workflow.failedAgent,
  ]);

  const reset = useCallback(() => {
    resultsRef.current = {};
    formRef.current = null;
    setWorkflow(createInitialWorkflow());
  }, []);

  return { workflow, run, retryFailed, reset };
}
