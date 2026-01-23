"use client";

import { useState } from "react";
import { prepareTransaction, toWei } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { client } from "@/lib/client";
import { supabase } from "@/supabase/client";
import { Toast } from "@/components/ui/Toast";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

const CREDIT_PACKAGES = [
  { id: "20-credits", credits: 20, ethAmount: "0.000125", label: "20 Credits" },
  {
    id: "100-credits",
    credits: 100,
    ethAmount: "0.000475",
    label: "100 Credits",
  },
  {
    id: "300-credits",
    credits: 300,
    ethAmount: "0.001225",
    label: "300 Credits",
    isBestValue: true,
  },
  {
    id: "600-credits",
    credits: 600,
    ethAmount: "0.002225",
    label: "600 Credits",
  },
];

export function TopUpModal({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: TopUpModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();
  const activeAccount = useActiveAccount();
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      /* 
      // Skip wallet transaction for now
      const transaction = prepareTransaction({
        to:
          process.env.NEXT_PUBLIC_SERVER_WALLET_ADDRESS ||
          "0x0000000000000000000000000000000000000000",
        chain: defineChain(8453), // Base Mainnet
        client: client,
        value: toWei(selectedPackage.ethAmount),
      });

      sendTransaction(transaction, {
        onSuccess: async (tx) => {
          // logic remains below
        }
      });
      */

      // Directly update credit flow
      // 1. Record Transaction (Mocking tx_hash since we skip wallet)
      const mockTxHash = `manual_${Math.random().toString(36).substring(2, 12)}`;

      const { error: txError } = await supabase.from("transactions").insert({
        user_id: userId,
        wallet_address:
          activeAccount?.address ||
          "0x0000000000000000000000000000000000000000",
        chain: "manual",
        tx_hash: mockTxHash,
        token_symbol: "ETH",
        token_decimals: 18,
        amount: parseFloat(selectedPackage.ethAmount),
        credits_granted: selectedPackage.credits,
        status: "success",
      });

      if (txError) throw txError;

      // 2. Update Credits using RPC for safety and logging
      const { error: creditError } = await supabase.rpc("topup_credit", {
        p_user_id: userId,
        p_amount: selectedPackage.credits,
      });

      if (creditError) throw creditError;

      setIsSuccess(true);
      if (onSuccess) onSuccess();

      // Wait a bit before closing
      setTimeout(() => {
        onClose();
        setIsProcessing(false);
        // Reset success state for next time the modal opens (though it might unmount anyway)
        setTimeout(() => setIsSuccess(false), 300);
      }, 3000);
    } catch (err: any) {
      console.error("Failed to process topup:", err);
      setToast({
        show: true,
        message: "Failed to update credits. Please try again.",
        type: "error",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Top Up Credits
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Top Up Successful!
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 px-4">
                Your account has been credited with{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {selectedPackage.credits} credits
                </span>
                . You can now continue generating magic.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Choose a credit package to continue generating and posting
                content.
              </p>

              <div className="space-y-3">
                {CREDIT_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                      selectedPackage.id === pkg.id
                        ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 dark:border-blue-400 dark:bg-blue-900/20"
                        : "border-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <p
                          className={`text-sm font-bold ${
                            selectedPackage.id === pkg.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-zinc-900 dark:text-white"
                          }`}
                        >
                          {pkg.label}
                        </p>
                        {(pkg as any).isBestValue && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            Best Value
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        Get {pkg.credits} credits to use across the platform
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-nowrap text-xs md:text-sm font-bold text-zinc-900 dark:text-white">
                        {pkg.ethAmount} ETH
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-col-reverse md:flex-row gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="flex-3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Pay {selectedPackage.ethAmount} ETH
                    </>
                  )}
                </button>
              </div>

              {!activeAccount && (
                <p className="mt-4 text-center text-xs text-red-500">
                  Please connect your wallet in the profile menu to pay.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
