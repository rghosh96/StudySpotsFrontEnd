import { getFirebase } from 'react-redux-firebase';

const safeCall = (callback) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = callback();
            resolve(await data);
        } catch (error) {
            reject(new Error(error.message));
        }
    })
}

// returns the currently-signed-in user's id
export const getUserId = () => {
    const callback = () => {
        let user = getFirebase().auth().currentUser; 
        
        if (user) {
            return user.uid.toString();
        } else {
            throw new Error("There is no user signed in.");
        }
    };

    return safeCall(callback);
}

// creates or overwrites a document
export const setDocumentData = (collection, document, data) => {
    const callback = () => {
        const firestore = getFirebase().firestore();
        return firestore.collection(collection).doc(document).set(data);
    };

    return safeCall(callback);
}

// returns the fields from a document
export const getDocumentData = (collection, document) => {
    const callback = () => {
        const firestore = getFirebase().firestore();
        return firestore.collection(collection).doc(document).get()
            .then(doc => {
                return doc.data();
            });
    };

    return safeCall(callback);
}

// for a document of a collection (outer) that has its own collections (inner), 
// set the data for an inner document
export const setNestedDocumentData = (outerCollec, outerDoc, innerCollec, innerDoc, data) => {
    const callback = () => {
        const firestore = getFirebase().firestore();
        return firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).doc(innerDoc).set(data);
    };
    
    return safeCall(callback);
}

// returns the fields from a nested document
export const getNestedDocumentData = (outerCollec, outerDoc, innerCollec, innerDoc) => {
    const callback = () => {
        const firestore = getFirebase().firestore();
        return firestore.collection(outerCollec).doc(outerDoc).collection(innerCollec).doc(innerDoc).get()
            .then(doc => {
                return doc.data();
            });
    };

    return safeCall(callback);
}

// appends value to the field of the document in the collection.
// returns reference to the document. value cannot be an object or array
export const appendToDocArray = (collection, document, field, value) => {
    const callback = () => {
        const firebase = getFirebase(); // connect to firebase
        const firestore = getFirebase().firestore();
        var docRef = firestore.collection(collection).doc(document);

        // Atomically add a new value to the array.
        docRef.update({
            [field]: firebase.firestore.FieldValue.arrayUnion(value)
        });

        return docRef;
    };

    return safeCall(callback);
}

// removes the value from the field of the document in the collection.
// returns reference to the document
export const removeFromDocArray = (collection, document, field, value) => {
    const callback = () => {
        const firebase = getFirebase(); // connect to firebase
        const firestore = getFirebase().firestore();
        var docRef = firestore.collection(collection).doc(document);

        // Atomically remove value from the array.
        docRef.update({
            [field]: firebase.firestore.FieldValue.arrayRemove(value)
        })

        return docRef;
    };

    return safeCall(callback);
}