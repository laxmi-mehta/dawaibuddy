import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Username" disabled />
        <Input type="email" placeholder="Email" disabled />
        <Input type="password" placeholder="Password" disabled />
        <Button className="w-full" disabled>
          Register — coming soon
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
