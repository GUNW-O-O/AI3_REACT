import React, { useState } from 'react'

const ProductDetail = ({ product }) => {

    // 👩‍💻 state 선언
    const [quantity, setQuantity] = useState(product.quantity)

    // 최종 가격 계산
    const totalPrice = product.price * quantity

    // +,- 이벤트 핸들러
    const onIncrease = () => {
        setQuantity(quantity + 1)
    }
    const onDecrease = () => {
        if (quantity > 0)
            setQuantity(quantity - 1)
    }


    return (
        <div class="container">
            <div className='product-detail'>
                <div className="item img">
                    <img src={product.img} alt={product.name} />
                </div>
                <div className="item info">
                    <div className="title">
                        <h1>{product.name}</h1>
                    </div>
                    <p>
                        <span className='txt-pt'>INFO</span><br />
                        -편안한 착용이 가능한 폴라 디자인 <br />
                        -체형 커버가 가능한 베이직한 실루엣 <br />
                    </p>
                    <p>
                        <span className="txt-pt">Color & Size</span> <br />
                        Black, Navy, Red <br />
                        85, 90, 95, 100, 110 <br />
                        - 어깨 53, 가슴 59, 암홀 23, 소매 62, 총장 68 <br />
                        (측정 방법에 따라 1~3cm 오차가 있을 수 있습니다) <br />
                    </p>
                    <span className='line-lg'></span>
                    <div className="text-group">
                        <div className="item">
                            <span className='txt-pt'>판매가</span>
                        </div>
                        <div className="item">
                            <span className='txt-pt'>{product.price.toLocaleString()} 원</span>
                        </div>
                    </div>
                    <div className="text-group">
                        <div className="item">
                            <span>배송비</span>
                        </div>
                        <div className="item">
                            <span>3,000</span> 원
                        </div>
                    </div>
                    <span className="line-lg"></span>
                    <div className="text-group">
                        <div className="item">
                            <span>Color</span>
                        </div>
                        <div className="item">
                            <select name="color" id="color">
                                <option value="Black">Black</option>
                                <option value="Navy">Navy</option>
                                <option value="Red">Red</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-group">
                        <div className="item">
                            <span>Size</span>
                        </div>
                        <div className="item">
                            <select name="color" id="color">
                                <option value="85">85</option>
                                <option value="90">90</option>
                                <option value="95">95</option>
                                <option value="100">100</option>
                                <option value="110">110</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-group">
                        <div className="item">
                            <span>수량</span>
                        </div>
                        <div className="item flex">
                            <input type="text" className='quantity' value={quantity} min={1} max={100} />  {/* value 를 state 로 변경 */}
                            <button className='btn btn-xs' onClick={onIncrease}>+</button>    {/* 이벤트 추가 */}
                            <button className='btn btn-xs' onClick={onDecrease}>-</button>    {/* 이벤트 추가 */}
                        </div>

                    </div>
                    <span className="line-lg"></span>
                    <div className="text-group">
                        <div className="item">
                            <span className='txt-pt'>최종 가격</span>
                        </div>
                        <div className="item">
                            <span className='txt-pt'>{totalPrice.toLocaleString()} 원</span>
                        </div>
                    </div>
                    <div className="text-group flex gap-1">
                        <div className="item">
                            <button className="btn btn-lg">구매하기</button>
                        </div>
                        <div className="item flex">
                            <button className="btn btn-lg btn-outline">장바구니</button>
                            <button className="btn btn-lg btn-outline">관심상품</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProductDetail