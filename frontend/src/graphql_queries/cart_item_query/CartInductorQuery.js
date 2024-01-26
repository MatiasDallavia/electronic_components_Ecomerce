import { gql } from '@apollo/client';

const GET_INDUCTOR_FROM_CART = gql`
query GetInductors($inputs: InductorInput!){
  inductorsQuery(inputs: $inputs) {
      model
      price
      inductance
      amountAvailable
  }
}`;


const singleInductorInput = {
  inputs: {
    id: null
  }
}


export {GET_INDUCTOR_FROM_CART, singleInductorInput}


