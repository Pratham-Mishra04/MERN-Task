export interface User {
  id: string;
  username: string;
  name: string;
  profilePic: string;
  coverPic: string;
  bio: string;
  tagline: string;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  userID: string;
  user: User;
}
