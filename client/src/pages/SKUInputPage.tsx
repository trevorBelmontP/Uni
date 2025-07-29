/**
 * SKUInputPage Component
 * 
 * Purpose: SKU input interface when barcode mode is OFF
 * - Shows input box instead of camera for SKU scanning
 * - Displays product cards with same functionality as camera mode
 * - Allows picking/unpicking items via input and button interactions
 * 
 * Flow: Shelf Selection → SKU Input → Item management
 */

import React, { useState } from 'react';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  pickedQuantity: number;
  vendor: string;
  status: 'GOOD' | 'DAMAGED';
  mrp: number;
  mfgDate: string;
  color: string;
}

export const SKUInputPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { id, shelfCode } = useParams<{ id: string; shelfCode: string }>();
  const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');
  const [skuInput, setSkuInput] = useState('');
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Nike Shoes-Red-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker',
      sku: 'SK238402-437493023012',
      quantity: 20,
      pickedQuantity: 0,
      vendor: 'B02363940',
      status: 'GOOD',
      mrp: 1000,
      mfgDate: '12/03/23',
      color: 'red',
    },
    {
      id: '2',
      name: 'Nike Shoes-Blue-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker',
      sku: 'SK238402-437493023012',
      quantity: 30,
      pickedQuantity: 0,
      vendor: 'B02363940',
      status: 'GOOD',
      mrp: 1000,
      mfgDate: '12/03/23',
      color: 'blue',
    },
    {
      id: '3',
      name: 'Nike Shoes-Black-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker',
      sku: 'SK238402-437493023012',
      quantity: 20,
      pickedQuantity: 0,
      vendor: 'B02363940',
      status: 'GOOD',
      mrp: 1000,
      mfgDate: '12/03/23',
      color: 'black',
    },
    {
      id: '4',
      name: 'Nike Shoes-Yellow-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker',
      sku: 'SK238402-437493023012',
      quantity: 20,
      pickedQuantity: 0,
      vendor: 'B02363940',
      status: 'GOOD',
      mrp: 1000,
      mfgDate: '12/03/23',
      color: 'yellow',
    },
  ]);

  const handleBack = () => {
    setLocation(`/shelf-selection/${id}`);
  };

  const handleClose = () => {
    setLocation(`/picklist/${id}`);
  };

  const handleSKUInput = () => {
    if (skuInput.trim()) {
      // Find product by SKU and pick one item
      const updatedProducts = products.map(product => {
        if (product.sku.includes(skuInput.trim()) && product.pickedQuantity < product.quantity) {
          return {
            ...product,
            pickedQuantity: product.pickedQuantity + 1
          };
        }
        return product;
      });
      setProducts(updatedProducts);
      setSkuInput('');
    }
  };

  const handlePickItem = (productId: string) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId && product.pickedQuantity < product.quantity) {
        return {
          ...product,
          pickedQuantity: product.pickedQuantity + 1
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleUnpickItem = (productId: string) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId && product.pickedQuantity > 0) {
        return {
          ...product,
          pickedQuantity: product.pickedQuantity - 1
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const pendingProducts = products.filter(p => p.pickedQuantity < p.quantity);
  const scannedProducts = products.filter(p => p.pickedQuantity > 0);

  const generateShoeImage = (color: string) => {
    const colorMap = {
      red: '#ef4444',
      blue: '#3b82f6', 
      black: '#1f2937',
      yellow: '#eab308',
    };
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 25 Q15 15 35 18 Q55 20 70 25 Q65 35 45 32 Q25 30 10 25 Z" fill="${colorMap[color as keyof typeof colorMap] || '#6b7280'}" stroke="#374151" stroke-width="1"/>
        <path d="M15 22 Q25 20 45 22 Q55 23 65 25" stroke="white" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="38" r="1.5" fill="white" opacity="0.6"/>
        <text x="32" y="18" text-anchor="middle" fill="#64748b" font-size="6" font-family="Arial, sans-serif" font-weight="bold">NIKE</text>
      </svg>
    `)}`;
  };

  const ProductCard: React.FC<{ product: Product; isPending: boolean }> = ({ product, isPending }) => {
    const pendingQty = product.quantity - product.pickedQuantity;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <div className="flex gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
            <img
              src={generateShoeImage(product.color)}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-gray-500">Qty </span>
                <span className="font-medium">
                  {isPending ? pendingQty : product.pickedQuantity}
                </span>
                {!isPending && (
                  <button 
                    onClick={() => handleUnpickItem(product.id)}
                    className="text-blue-600 ml-1 text-xs hover:underline"
                  >
                    (click to unpick)
                  </button>
                )}
              </div>
              <div className="text-right">
                <span className="text-gray-500">Vendor </span>
                <span className="font-medium">{product.vendor}</span>
              </div>
              
              <div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.status === 'GOOD' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {product.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-500">MRP </span>
                <span className="font-medium">₹{product.mrp.toLocaleString()}</span>
              </div>
              
              <div className="col-span-2">
                <span className="text-gray-500">Mfg </span>
                <span className="font-medium">{product.mfgDate}</span>
              </div>
            </div>

            {isPending && pendingQty > 0 && (
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => handlePickItem(product.id)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                >
                  Pick Item
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{shelfCode}</h1>
        </div>
        <button 
          onClick={handleClose}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded"
        >
          CLOSE
        </button>
      </div>

      {/* SKU Input Section */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Scan SKU Code"
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            className="pl-10 pr-16 py-3 border border-gray-300 rounded-lg text-base"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSKUInput();
              }
            }}
          />
          <Button
            onClick={handleSKUInput}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">{pendingProducts.length}</span>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'scanned'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('scanned')}
          >
            Scanned <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{scannedProducts.length}</span>
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="p-4">
        {activeTab === 'pending' ? (
          pendingProducts.length > 0 ? (
            pendingProducts.map(product => (
              <ProductCard key={product.id} product={product} isPending={true} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              All items have been picked
            </div>
          )
        ) : (
          scannedProducts.length > 0 ? (
            scannedProducts.map(product => (
              <ProductCard key={product.id} product={product} isPending={false} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items scanned yet
            </div>
          )
        )}
      </div>
    </div>
  );
};