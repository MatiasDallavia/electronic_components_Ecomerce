import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';


import minusIcon from '../images/icons/minus.png'
import plusIcon from '../images/icons/plus.png'
import xIcon from '../images/icons/x.webp'

import {GET_CAPACITOR_FROM_CART} from "../graphql_queries/cart_item_query/CartCapacitorQuery"
import {GET_DIODE_FROM_CART} from "../graphql_queries/cart_item_query/CartDiodeQuery"
import {GET_RESISTOR_FOR_CART} from "../graphql_queries/cart_item_query/CartResistorQuery"
import {GET_TRANSISTOR_FOR_CART} from "../graphql_queries/cart_item_query/CartTransistorQuery"
import {GET_INDUCTOR_FROM_CART} from "../graphql_queries/cart_item_query/CartInductorQuery"


function CartItemTableRow({componentType, componentID, removeItemFromList, serTotalValue,productsToPurchase, setProductsToPurchase}) {
  const [count, setProductCount] = useState(0)
  const [prevCount, setPrevProductCount] = useState(0)
  const [productCountValue, setProductCountValue] = useState(0)




  let queryComponentType;
  let querySchema;
  let inputVariables = {
    inputs:{
        id:componentID
        }
    }
  
    switch (componentType) {
        case "inductor":
          querySchema = GET_INDUCTOR_FROM_CART;
          queryComponentType = "inductorListQuery"
          break;
        case "capacitor":
           querySchema = GET_CAPACITOR_FROM_CART;
           queryComponentType = "capacitorListQuery"
           break;
        case "resistor":
          querySchema = GET_RESISTOR_FOR_CART
          queryComponentType = "resistorListQuery"
          break;          
        case "diode":
           querySchema = GET_DIODE_FROM_CART
           queryComponentType = "diodeListQuery"
           break;
        case "BJT":
        case "MOSFET":
        case "IGBT":
           querySchema = GET_TRANSISTOR_FOR_CART
           queryComponentType = "transistorListQuery"
           inputVariables.inputs.transistorType = componentType
           break;
     
      }
 


  const { loading, error, data } = useQuery(querySchema, { variables: inputVariables });


  const component = data ? data[queryComponentType][0] : [];    


  function updateProductCount(count) {
    setProductCount((currentCount) => {
        if ( currentCount + count >= 0 ){ 
          setPrevProductCount(currentCount) 
         const newCount = currentCount + count
         const newValue = newCount * component.price
         setProductCountValue(newValue.toFixed(2))         
         return newCount 
        }
        return 0
    })
  }

  useEffect(() => {
    setProductsToPurchase((prevProductsToPurchase) => {
      return [...prevProductsToPurchase, {
        "componentType" : componentType,
        "componentId": componentID,
        "price": component.price,
        "quantity": count
        } ]
      }
    );
  }, []);


    let productName;

    switch (componentType) {
        case "inductor":
          console.log("INDUCTOR", component)
            productName = componentType + " " + component.inductance        
          break;
        case "capacitor":
            productName = componentType + " " + component.capacitance        
           break;
        case "resistor":
            productName = componentType + " " +component.resistance        
          break;          
        case "diode":
        case "BJT":
        case "MOSFET":
        case "IGBT":
            productName = componentType + " " + component.model        

           break;
      }

      //takes cara of updating the sum of all product taking into account their quantity
      useEffect(() => {
        console.log("component.PRICE: ", component.price)
        if (count > 0 || (count === 0 && prevCount === 1)) {
          const newValue = Number(productCountValue);
      
          if (!isNaN(newValue)) {
      
            serTotalValue((prevTotal) => {
              let newTotal;
      
              if (count > prevCount) {
                newTotal = prevTotal + component.price;
              } else if (count < prevCount) {
                newTotal = prevTotal - component.price;
              }
      
              return !isNaN(newTotal) ? parseFloat(newTotal.toFixed(2)) : prevTotal;
            });
          }
        }
      }, [count]);


      useEffect(()=>{

        const result = productsToPurchase.filter((item) => 
        (item.componentType !== componentType && item.componentId !== componentID)
        )
        result.push({
          "componentType" : componentType,
          "componentId": componentID,
          "price": component.price,
          "quantity": count
        })
        console.log(result)
        setProductsToPurchase(result)
        console.log("RESULT: ", productsToPurchase)
      }, [count, component.price])
      


  return (
    <li id={componentType + componentID} className="list-group-item d-flex align-items-center justify-content-between cart-item-list">
        <div className="d-flex align-items-center pt-2">
            <img 
                className="x_icon" 
                src={xIcon} 
                alt="X Icon" 
                onClick={() => { removeItemFromList(componentType, componentID);}}
            />
            <h6 className="product-name">{productName}</h6>
        </div>
        <div className="d-flex align-items-center">
            <p style={{ color: 'red', margin: '0', marginRight: '10px' }}>{component.price}</p>
        </div>
        <div className="d-flex align-items-center">
            <img 
                src={plusIcon} 
                onClick={() => {updateProductCount(1, setProductCountValue)}} 
                className="plus_minus_icon m-2" 
                alt="Plus Icon" 
            />
            <p style={{ width: "20px", color: 'red', margin: '0 10px' }}>{count}</p>
            <img 
                src={minusIcon} 
                onClick={() => {updateProductCount(-1, setProductCountValue)}} 
                className="plus_minus_icon m-2" 
                alt="Minus Icon" 
            />
        </div>
        <p className="text-body-secondary product-component.price" style={{ width: "64px" ,margin: '0', marginLeft: '10px' }}>${productCountValue}</p>
    </li>
    )
}

export default CartItemTableRow