import {Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from "react-error-boundary"
import { useNavigate } from 'react-router-dom';




const Suspenser = () => {

    const navigate = useNavigate()


    const errorFallback = ({ error, resetErrorBoundary }) => {
        return (
        <div role="alert">
          <p>Something went wrong: </p>
          <pre style={{ color: "red" }}>{error.message}</pre>
       </div>
    )}


  return (
    <ErrorBoundary fallback={errorFallback} onReset={() => {}}>
        <Suspense fallback={() => <h1>Loading ...</h1>} >
            <Outlet/>
        </Suspense>
    </ErrorBoundary>
    
  )
}


export default Suspenser