import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-lg font-medium">Etwas ist schiefgelaufen.</h2>
          <p className="text-sm text-muted-foreground mt-1">Bitte lade die Seite neu.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
