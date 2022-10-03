// For debugging purposes
import React from "react";
import PageUnavailable from "../../../Pages/Portal/PageUnavailable/PageUnavailable";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(`Error: ${error}`);
    console.log(`Info:`)
    console.log(errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <>
        <PageUnavailable code='systemerr' />
      </>
    }

    return this.props.children; 
  }
}
export default ErrorBoundary;