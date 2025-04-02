import React from 'react';
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Navigate 
} from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LoginPage } from './pages/LogInPage';
import { PostsPage } from './pages/PostPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<PostsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/" element={<Navigate to="/home" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;