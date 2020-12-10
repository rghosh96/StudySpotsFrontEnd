import { getFirebase } from 'react-redux-firebase';

const safeCall = async (callback) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await callback();
            resolve(await data);
        } catch (error) {
            reject(new Error(error.message));
        }
    })
}

// returns the currently-signed-in user's id
export const getUserId = async () => {
    const callback = async () => {
        let user = await getFirebase().auth().currentUser; 
        
        if (user) {
            return await user.uid.toString();
        } else {
            throw new Error("There is no user signed in.");
        }
    };

    return await safeCall(callback);
}

// creates or overwrites a document
export const setDocumentData = async (collection, document, data) => {
    const callback = async () => {
        const firestore = await getFirebase().firestore();
        
        return await firestore.collection(collection).doc(document).set(data);
    };

    return await safeCall(callback);
}

// returns the fields from a document
export const getDocumentData = async (collection, document) => {
    const callback = async () => {
        const firestore = await getFirebase().firestore();
        return await firestore.collection(collection).doc(document).get()
            .then(async doc => {
                return await doc.data();
            });
    };

    return await safeCall(callback);
}

// for a document of a collection (outer) that has its own collections (inner), 
// set the data for an inner document
export const setNestedDocumentData = async (outerCollec, outerDoc, innerCollec, innerDoc, data) => {
    const callback = async () => {
        const firestore = await getFirebase().firestore();
        return await firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).doc(innerDoc).set(data);
    };
    
    return await safeCall(callback);
}

// returns the fields from a nested document
export const getNestedDocumentData = async (outerCollec, outerDoc, innerCollec, innerDoc) => {
    const callback = async () => {
        const firestore = await getFirebase().firestore();
        return await firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).doc(innerDoc).get()
            .then(async doc => {
                return await doc.data();
            });
    };

    return await safeCall(callback);
}

// appends value to the field of the document in the collection.
// returns reference to the document. value cannot be an object or array
export const appendToDocArray = async (collection, document, field, value) => {
    const callback = async () => {
        const firebase = await getFirebase(); // connect to firebase
        const firestore = await getFirebase().firestore();
        var docRef = await firestore.collection(collection).doc(document);

        // Atomically add a new value to the array.
        docRef.update({
            [field]: await firebase.firestore.FieldValue.arrayUnion(value)
        });

        return await docRef;
    };

    return await safeCall(callback);
}

// removes the value from the field of the document in the collection.
// returns reference to the document
export const removeFromDocArray = async (collection, document, field, value) => {
    const callback = async () => {
        const firebase = getFirebase(); // connect to firebase
        const firestore = getFirebase().firestore();
        var docRef = firestore.collection(collection).doc(document);

        // Atomically remove value from the array.
        docRef.update({
            [field]: firebase.firestore.FieldValue.arrayRemove(value)
        })

        return await docRef;
    };

    return await safeCall(callback);
}

export const addAmbiguousDoc = async (outerCollec, outerDoc, innerCollec) => {
    const callback = async () => {
        
        const firestore = await getFirebase().firestore();

        return await firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).add({});

    };

    return await safeCall(callback);
}

export const removeDocFromNestedDocArray = async (outerCollec, outerDoc, innerCollec, innerDoc) => {
    const callback = async () => {
    
        const firestore = await getFirebase().firestore();

        return await firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).doc(innerDoc).delete();

    };

    return await safeCall(callback);
}

export const getNestedCollectionData = async (outerCollec, outerDoc, innerCollec) => {
    const callback = async () => {
        
        const firestore = await getFirebase().firestore();

        return await firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).get();

    };

    return await safeCall(callback);
}