// Market.js

import React, { useState } from 'react';
import styles from './Market.module.css'; // 引入 Market 模組化 CSS

const Market = () => {
    // 商品清單
    const [courses, setCourses] = useState([
        { id: 1, name: '謝新達演唱會', price: 499, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpivYcK_dq0CBy2vZA1fF_lY0933GN7O73_Q&s' },
        { id: 2, name: '獵人盲卡包', price: 699, image: 'https://www.niusnews.com/upload/imgs/default/202410_Noah/1021/hhmc/hhmc3.jpg' },
        { id: 3, name: 'Blackpink演唱會', price: 799, image: 'https://res.klook.com/image/upload/v1673235227/t3ekbheixpckowesyoq9.jpg' }
    ]);

    // 購物車和搜尋狀態
    const [cartCourses, setCartCourses] = useState([]);
    const [searchCourse, setSearchCourse] = useState('');

    // 新增商品至購物車
    const addCourseToCartFunction = (GFGcourse) => {
        const existingItem = cartCourses.find(item => item.product.id === GFGcourse.id);
        if (existingItem) {
            const updatedCart = cartCourses.map(item =>
                item.product.id === GFGcourse.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartCourses(updatedCart);
        } else {
            setCartCourses([...cartCourses, { product: GFGcourse, quantity: 1 }]);
        }
    };

    // 從購物車移除商品
    const deleteCourseFromCartFunction = (GFGCourse) => {
        const updatedCart = cartCourses.filter(item => item.product.id !== GFGCourse.id);
        setCartCourses(updatedCart);
    };

    // 計算購物車總金額
    const totalAmountCalculationFunction = () => {
        return cartCourses.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    // 處理商品數量變更
    const handleQuantityChange = (productId, newQuantity) => {
        setCartCourses(prevItems =>
            prevItems.map(item =>
                item.product.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // 搜尋功能
    const courseSearchUserFunction = (event) => {
        setSearchCourse(event.target.value);
    };

    // 過濾商品
    const filterCourseFunction = courses.filter((course) =>
        course.name.toLowerCase().includes(searchCourse.toLowerCase())
    );

    return (
        <div className={styles.marketContainer}>
            <header className={styles.header}>
                <h1>NFT票卷交易市場</h1>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search for GFG Products..."
                        value={searchCourse}
                        onChange={courseSearchUserFunction}
                    />
                </div>
            </header>

            <main className={styles.mainContent}>
                {/* 顯示商品列表 */}
                <div className={styles.productList}>
                    {filterCourseFunction.length === 0 ? (
                        <p className={styles.noResults}>Sorry Geek, No matching Product found.</p>
                    ) : (
                        filterCourseFunction.map((product) => (
                            <div className={styles.product} key={product.id}>
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                                <h2>{product.name}</h2>
                                <p>Price: ₹{product.price}</p>
                                <button
                                    className={styles.addToCartButton}
                                    onClick={() => addCourseToCartFunction(product)}
                                >
                                    Add to Shopping Cart
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* 購物車 */}
                <div className={`${styles.cart} ${cartCourses.length > 0 ? styles.active : ''}`}>
                    <h2>My Cart</h2>
                    {cartCourses.length === 0 ? (
                        <p className={styles.emptyCart}>Geek, your cart is empty.</p>
                    ) : (
                        <div>
                            <ul className={styles.cartList}>
                                {cartCourses.map((item) => (
                                    <li key={item.product.id} className={styles.cartItem}>
                                        <div className={styles.itemInfo}>
                                            <img src={item.product.image} alt={item.product.name} className={styles.cartItemImage} />
                                            <div className={styles.itemDetails}>
                                                <h3>{item.product.name}</h3>
                                                <p>Price: ₹{item.product.price}</p>
                                            </div>
                                        </div>
                                        <div className={styles.itemActions}>
                                            <button
                                                className={styles.removeButton}
                                                onClick={() => deleteCourseFromCartFunction(item.product)}
                                            >
                                                Remove Product
                                            </button>
                                            <div className={styles.quantityControl}>
                                                <button onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}>+</button>
                                                <p>{item.quantity}</p>
                                                <button onClick={() => handleQuantityChange(item.product.id, Math.max(item.quantity - 1, 1))}>-</button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.checkoutSection}>
                                <p className={styles.totalAmount}>Total Amount: ₹{totalAmountCalculationFunction()}</p>
                                <button
                                    className={styles.checkoutButton}
                                    disabled={cartCourses.length === 0 || totalAmountCalculationFunction() === 0}
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Market;
