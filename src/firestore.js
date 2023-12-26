const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore();

const plant = async (name) => {
   try{
      const plantDoc = await firestore.collection('dataOutput').doc(name).get();

      if(!plantDoc.exists){
         return{
            status: false
         };
      }

      const plantData = plantDoc.data();
      return{
         status: true,
         data: plantData
      };
   } catch(error){
      console.error('Error while searching for plant: ', error);
      return{
         status: false,
         error: error.message
      };
   }
};

module.exports = {plant};