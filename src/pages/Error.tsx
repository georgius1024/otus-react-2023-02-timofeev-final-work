import { ReactElement } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/Card";
export default function ErrorPage(): ReactElement {
  return (
    <Card title="Error">
      <h1>Error</h1>
      <p>Wrong page address</p>
      <Link className="btn btn-secondary" to="/">Home page</Link>
    </Card>
  );
}
