import React, { useState, useMemo } from 'react'
import { Coffee, ShoppingCart, Plus, Minus, CheckCircle, Clock } from 'lucide-react'
import { placeOrder } from '../../services/canteenService'
import { useCanteenOrders } from '../../hooks/useCanteen'

// Hardcoded menu for MVP
const MENU_CATEGORIES = [
  {
    name: 'Quick Bites',
    items: [
      { id: 'c1', name: 'Veg Burger', price: 50, emoji: '🍔', desc: 'Crispy aloo patty with fresh veggies.' },
      { id: 'c2', name: 'French Fries', price: 40, emoji: '🍟', desc: 'Salted potato fries.' },
      { id: 'c3', name: 'Masala Sandwich', price: 35, emoji: '🥪', desc: 'Grilled sandwich with spicy potato filling.' },
    ]
  },
  {
    name: 'Beverages',
    items: [
      { id: 'c4', name: 'Cold Coffee', price: 60, emoji: '🥤', desc: 'Creamy blended iced coffee.' },
      { id: 'c5', name: 'Masala Chai', price: 15, emoji: '☕', desc: 'Hot ginger and cardamom tea.' },
      { id: 'c6', name: 'Fresh Lime Soda', price: 30, emoji: '🍋', desc: 'Refreshing sweet/salt soda.' },
    ]
  },
  {
    name: 'Meals',
    items: [
      { id: 'c7', name: 'Veg Thali', price: 120, emoji: '🍛', desc: 'Roti, rice, dal, 2 sabzi, sweet.' },
      { id: 'c8', name: 'Paneer Tikka Masala', price: 150, emoji: '🥘', desc: 'Spicy paneer curry with 3 rotis.' },
    ]
  }
]

export default function SmartCanteen() {
  const { orders, loading: ordersLoading, refetch } = useCanteenOrders()
  const [cart, setCart] = useState({}) // { [id]: quantity }
  const [placingOrder, setPlacingOrder] = useState(false)
  
  // Flatten menu to lookup items
  const allItems = useMemo(() => MENU_CATEGORIES.flatMap(c => c.items), [])
  
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = allItems.find(i => i.id === id)
        return { ...item, quantity: qty }
      })
      .filter(i => i.quantity > 0)
  }, [cart, allItems])
  
  const cartTotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cartItems])

  function handleAdd(id) {
    setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }))
  }

  function handleRemove(id) {
    setCart(p => {
      const current = p[id] || 0
      if (current <= 1) {
        const next = { ...p }
        delete next[id]
        return next
      }
      return { ...p, [id]: current - 1 }
    })
  }

  async function handlePlaceOrder() {
    if (cartItems.length === 0) return
    setPlacingOrder(true)
    try {
      await placeOrder(cartItems, cartTotal)
      setCart({})
      refetch()
      alert('Order placed successfully! Please pay at the counter (Digital payment mock).')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-6">
      
      {/* Left: Menu */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-2xl">
            <Coffee className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Smart Canteen</h1>
            <p className="text-slate-400 text-sm">Skip the queue, order ahead.</p>
          </div>
        </div>

        {MENU_CATEGORIES.map(category => (
          <div key={category.name} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-700">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.items.map(item => {
                const qty = cart[item.id] || 0
                return (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.emoji}</span>
                        <h3 className="font-semibold text-slate-800">{item.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">{item.desc}</p>
                      <p className="font-bold text-slate-900">₹{item.price}</p>
                    </div>
                    <div>
                      {qty === 0 ? (
                        <button onClick={() => handleAdd(item.id)}
                          className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium rounded-xl text-sm transition-colors">
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                          <button onClick={() => handleRemove(item.id)} className="p-1 text-slate-500 hover:text-slate-700"><Minus className="w-4 h-4"/></button>
                          <span className="font-semibold text-sm w-4 text-center">{qty}</span>
                          <button onClick={() => handleAdd(item.id)} className="p-1 text-orange-600 hover:text-orange-700"><Plus className="w-4 h-4"/></button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Cart & Orders Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 space-y-6">
        
        {/* Cart */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800">Your Cart</h2>
          </div>
          
          <div className="p-5">
            {cartItems.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{item.quantity}x</span>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Total</span>
                  <span className="text-lg font-bold text-slate-900">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {placingOrder ? 'Processing...' : 'Place Order & Pay'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Orders */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Live Orders</h2>
          {ordersLoading ? (
            <p className="text-sm text-slate-400">Loading orders...</p>
          ) : orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length === 0 ? (
            <p className="text-sm text-slate-400">No active orders.</p>
          ) : (
            <div className="space-y-3">
              {orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').map(order => {
                let parsedItems = []
                try { parsedItems = JSON.parse(order.itemsJson) } catch(e){}
                
                const isReady = order.status === 'READY'
                
                return (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    {isReady && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">Order #{order.id}</p>
                        <p className="font-semibold text-sm text-slate-800">₹{order.totalAmount}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        isReady ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      {parsedItems.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
