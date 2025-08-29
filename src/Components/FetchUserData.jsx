import { auth, database } from './Firebase'
import { doc, getDoc } from 'firebase/firestore'

export const FetchUserData = async ({ onSuccess, onFail }) => {
  auth.onAuthStateChanged(async user => {
    if (!user) {
      onFail && onFail()
      return
    }

    try {
      const docSnap = await getDoc(doc(database, 'Users', user.uid))
      if (docSnap.exists()) {
        const data = docSnap.data()
        onSuccess && onSuccess(data)
      } else {
        onFail && onFail()
      }
    } catch {
      onFail && onFail()
    }
  })
}
