"use client";

import { useState } from "react";
import { useIAM } from "@/lib/iamContext";
import { getProof } from "@/lib/iamClient";
import { getProducts } from "@/services/productServices";
import { getCategories } from "@/services/categoryService";
import { getOrders } from "@/services/orderService";
import { getDashboard } from "@/services/dashboardService";

export default function TestAPIPage() {
  const { user, loading } = useIAM();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<string | null>(null);

  async function testEndpoint(name: string, fn: () => Promise<any>) {
    setTesting(name);
    try {
      const result = await fn();
      setTestResults((prev) => ({
        ...prev,
        [name]: { success: true, data: result },
      }));
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        [name]: {
          success: false,
          error: error.message || "Failed",
          status: error.response?.status,
        },
      }));
    } finally {
      setTesting(null);
    }
  }

  async function testAll() {
    await testEndpoint("Products", getProducts);
    await testEndpoint("Categories", getCategories);
    await testEndpoint("Orders", getOrders);
    await testEndpoint("Dashboard", getDashboard);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          You must be logged in to test the API. Please <a href="/login" className="underline">log in</a>.
        </div>
      </div>
    );
  }

  const sessionProof = getProof();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Integration Test</h1>

      {/* User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">Current User</h2>
        <p className="text-sm text-blue-800">
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-blue-800">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-sm text-blue-800">
          <strong>Org:</strong> {user.org.name} ({user.org.slug})
        </p>
      </div>

      {/* Environment Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-slate-900 mb-2">Environment Configuration</h2>
        <div className="space-y-1 text-sm">
          <p>
            <strong>IAM URL:</strong>{" "}
            <code className="bg-slate-200 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_IAM_URL}
            </code>
          </p>
          <p>
            <strong>API URL:</strong>{" "}
            <code className="bg-slate-200 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL}
            </code>
          </p>
          <p>
            <strong>Client ID:</strong>{" "}
            <code className="bg-slate-200 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_IAM_CLIENT_ID}
            </code>
          </p>
          <p>
            <strong>Session Proof:</strong>{" "}
            <code className="bg-slate-200 px-2 py-1 rounded text-xs">
              {sessionProof ? `${sessionProof.substring(0, 30)}...` : "Not found"}
            </code>
            {sessionProof ? (
              <span className="ml-2 text-green-600">✓</span>
            ) : (
              <span className="ml-2 text-red-600">✗</span>
            )}
          </p>
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-3">API Endpoint Tests</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={testAll}
            disabled={testing !== null}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Test All Endpoints
          </button>
          <button
            onClick={() => testEndpoint("Products", getProducts)}
            disabled={testing !== null}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Test Products
          </button>
          <button
            onClick={() => testEndpoint("Categories", getCategories)}
            disabled={testing !== null}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            Test Categories
          </button>
          <button
            onClick={() => testEndpoint("Orders", getOrders)}
            disabled={testing !== null}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
          >
            Test Orders
          </button>
          <button
            onClick={() => testEndpoint("Dashboard", getDashboard)}
            disabled={testing !== null}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Test Dashboard
          </button>
        </div>

        {testing && (
          <div className="text-sm text-blue-600">Testing {testing}...</div>
        )}
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3">Test Results</h2>
          <div className="space-y-3">
            {Object.entries(testResults).map(([name, result]) => (
              <div
                key={name}
                className={`border rounded-lg p-4 ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    {result.success ? "✓" : "✗"} {name}
                  </h3>
                  {result.status && (
                    <span className="text-sm">Status: {result.status}</span>
                  )}
                </div>
                {result.success ? (
                  <div>
                    <p className="text-sm text-green-700 mb-2">
                      Request successful!
                    </p>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-green-600 hover:text-green-800">
                        View Response Data
                      </summary>
                      <pre className="mt-2 bg-white p-2 rounded border border-green-200 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <div className="text-sm text-red-700">
                    <p>
                      <strong>Error:</strong> {result.error}
                    </p>
                    {result.status === 401 && (
                      <p className="mt-2 text-xs">
                        This might mean your backend is not accepting IAM session proofs.
                        Check your backend authentication configuration.
                      </p>
                    )}
                    {result.status === 404 && (
                      <p className="mt-2 text-xs">
                        Endpoint not found. Check your API URL configuration.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">
          How to Use This Test Page
        </h3>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Ensure you're logged in (you should see your user info above)</li>
          <li>Check that the environment variables are correctly configured</li>
          <li>Verify that a session proof exists</li>
          <li>Click "Test All Endpoints" or test individual endpoints</li>
          <li>
            Check the results - green means success, red means there's an issue
          </li>
          <li>
            Open browser DevTools → Network tab to see the actual requests and headers
          </li>
        </ol>
      </div>

      {/* What to Check */}
      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 mb-2">
          Network Tab - Headers to Verify
        </h3>
        <p className="text-sm text-slate-700 mb-2">
          In DevTools → Network, click on any request and check:
        </p>
        <div className="text-xs bg-white p-3 rounded border border-slate-200 font-mono">
          <p>Request Headers:</p>
          <p className="text-green-600">✓ x-session-proof: [your-session-proof]</p>
          <p className="text-green-600">✓ x-client-id: {process.env.NEXT_PUBLIC_IAM_CLIENT_ID}</p>
          <p className="text-green-600">✓ cookie: iam_refresh=...</p>
        </div>
      </div>
    </div>
  );
}
