import { useState } from "react";
import { signIn, signUp, logout, onAuthChange } from "@/config/firebaseUtils";

export default function AuthExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  onAuthChange((currentUser) => {
    setUser(currentUser);
  });

  const handleSignIn = async () => {
    try {
      const result = await signIn(email, password);
      console.log("Đã đăng nhập:", result.user);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      const result = await signUp(email, password);
      console.log("Đã tạo tài khoản:", result.user);
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Đã đăng xuất");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <div>
      {!user ? (
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button onClick={handleSignIn}>Đăng nhập</button>
          <button onClick={handleSignUp}>Tạo tài khoản</button>
        </div>
      ) : (
        <div>
          <p>Xin chào, {user.email}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      )}
    </div>
  );
}
