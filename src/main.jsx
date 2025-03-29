import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Signin from "./SigninPage/Signin";
import Signup from "./SignupPage/Signup";
import Home from "./HomePage/Home";
import Choose from "./Choose Hobby/Choose";
import CommunityPage from "./CommunityPage/CommunityPage";
import Chat from "./CommunityPage/Chat";
import ProfilePage from "./ProfilePage/ProfilePage";
import ProductGrid from "./Products/ProductGrid";
import ProductDetail from "./ProductDetails/ProductDetail";
import Placeorder from "./PlaceOrder/Placeorder";
import SellerDashboard from "./SellerDashboard/SellerDashboard";
import ProductCart from "./ProductCart/ProductCart";
import PostFeed from "./PostFeed/PostFeed";
import SpecificPost from "./SpecificPost/SpecificPost";
import Journal from "./JournalMaking/Journal";



const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/sign-in" element={<Signin></Signin>}></Route>
      <Route path="/sign-up" element={<Signup></Signup>}></Route>
      <Route path="/home-page" element={<Home></Home>}></Route>
      <Route path="/hobby-selection" element={<Choose></Choose>}></Route>
      <Route path="/community-page" element={<CommunityPage />}>
        {/* Nested route for Chat */}
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<ProfilePage></ProfilePage>}></Route>
        <Route path="products" element={<ProductGrid></ProductGrid>}></Route>
        <Route path="productdetail" element={<ProductDetail></ProductDetail>}></Route>
        <Route path="placeorder" element={<Placeorder></Placeorder>}></Route>
        <Route path="sellerboard" element={<SellerDashboard></SellerDashboard>}></Route>
        <Route path="productcart" element={<ProductCart></ProductCart>}></Route>
        <Route path="allposts" element={<PostFeed></PostFeed>}></Route>
        <Route path="specificpost" element={<SpecificPost></SpecificPost>}></Route>
        <Route path="journal" element={<Journal></Journal>}></Route>
      </Route>

    </Routes>
  </BrowserRouter>
);
