/**
 * Example component demonstrating IAM permission-based rendering
 * and API calls with authentication.
 */
"use client";

import { useIAM } from "@/lib/iamContext";
import { api } from "@/lib/apiClient";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function PermissionExample() {
  const { user, can, canAny, loading, logout } = useIAM();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Example: Fetch data with authenticated API call
  async function fetchProducts() {
    if (!can("products:read")) {
      alert("You don't have permission to view products");
      return;
    }

    setLoadingProducts(true);
    try {
      const response = await api.products.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      alert("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }

  // Example: Permission-based button rendering
  function renderActions() {
    const actions = [];

    if (can("products:read")) {
      actions.push(
        <Button
          key="view"
          text="View Products"
          onClick={fetchProducts}
          loading={loadingProducts}
        />
      );
    }

    if (can("products:write")) {
      actions.push(
        <Button
          key="add"
          text="Add Product"
          onClick={() => alert("Add product clicked")}
        />
      );
    }

    if (can("products:delete")) {
      actions.push(
        <Button
          key="delete"
          text="Delete Products"
          onClick={() => alert("Delete clicked")}
          variant="danger"
        />
      );
    }

    return actions.length > 0 ? (
      <div className="flex gap-2">{actions}</div>
    ) : (
      <p className="text-slate-500">You don't have any product permissions</p>
    );
  }

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">IAM Permission Example</h1>
        <p className="text-slate-600 mb-4">
          This component demonstrates permission-based rendering and authenticated API calls.
        </p>

        {/* User Information */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h2 className="font-semibold mb-2">Current User</h2>
          <p>
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Organization:</strong> {user?.org.name} ({user?.org.slug})
          </p>
        </div>

        {/* Permission Checks */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Your Permissions</h2>
          <ul className="space-y-1 text-sm">
            <li>
              products:read -{" "}
              <span className={can("products:read") ? "text-green-600" : "text-red-600"}>
                {can("products:read") ? "✓ Granted" : "✗ Denied"}
              </span>
            </li>
            <li>
              products:write -{" "}
              <span className={can("products:write") ? "text-green-600" : "text-red-600"}>
                {can("products:write") ? "✓ Granted" : "✗ Denied"}
              </span>
            </li>
            <li>
              products:delete -{" "}
              <span className={can("products:delete") ? "text-green-600" : "text-red-600"}>
                {can("products:delete") ? "✓ Granted" : "✗ Denied"}
              </span>
            </li>
          </ul>
        </div>

        {/* Conditional Rendering Based on Permissions */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Available Actions</h2>
          {renderActions()}
        </div>

        {/* Using canAny() for multiple permissions */}
        {canAny("products:write", "products:delete") && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-semibold text-amber-800 mb-1">Admin Notice</h3>
            <p className="text-sm text-amber-700">
              You have elevated permissions (write or delete). Use them responsibly.
            </p>
          </div>
        )}

        {/* Products List */}
        {products.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Products</h2>
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-slate-600">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="pt-4 border-t">
          <Button text="Logout" onClick={logout} variant="secondary" />
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-slate-900 text-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Code Examples</h2>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            1. Check Single Permission
          </h3>
          <pre className="text-xs bg-slate-800 p-3 rounded overflow-x-auto">
            {`const { can } = useIAM();

if (can("products:write")) {
  // Show edit button
}`}
          </pre>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            2. Check Multiple Permissions
          </h3>
          <pre className="text-xs bg-slate-800 p-3 rounded overflow-x-auto">
            {`const { canAny } = useIAM();

if (canAny("products:write", "products:delete")) {
  // User has at least one of these permissions
}`}
          </pre>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            3. Make Authenticated API Call
          </h3>
          <pre className="text-xs bg-slate-800 p-3 rounded overflow-x-auto">
            {`import { api } from "@/lib/apiClient";

const response = await api.products.getAll();
console.log(response.data);`}
          </pre>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">4. Logout User</h3>
          <pre className="text-xs bg-slate-800 p-3 rounded overflow-x-auto">
            {`const { logout } = useIAM();

await logout();
router.push("/login");`}
          </pre>
        </div>
      </div>
    </div>
  );
}
