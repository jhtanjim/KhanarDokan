import React, { useState, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Edit3, 
    Save, 
    X, 
    Camera,
    Shield,
    Key,
    Bell
} from 'lucide-react';

const UserProfile = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        displayName: user?.displayName || 'Jawad Hossain Tanjim',
        email: user?.email || 'bakersdelightwithafri@gmail.com',
        phone: '',
        address: '',
        bio: 'Food enthusiast and loyal customer'
    });

    console.log(user);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            // Reset to original values if canceling
            setEditedProfile({
                displayName: user?.displayName || 'Jawad Hossain Tanjim',
                email: user?.email || 'bakersdelightwithafri@gmail.com',
                phone: '',
                address: '',
                bio: 'Food enthusiast and loyal customer'
            });
        }
    };

    const handleSave = () => {
        // Here you would typically update the user profile in Firebase
        console.log('Saving profile:', editedProfile);
        setIsEditing(false);
        // Add your Firebase update logic here
    };

    const handleInputChange = (field, value) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatDate = (timestamp) => {
        return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500"></div>
                    <div className="relative px-6 pb-6">
                        {/* Profile Photo */}
                        <div className="relative -mt-16 mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-orange-500">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                                <Camera className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {user?.displayName || 'Jawad Hossain Tanjim'}
                                </h1>
                                <p className="text-gray-600 mb-1">{user?.email}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Member since {formatDate(user?.createdAt || '1751003459087')}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleEditToggle}
                                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                            
                            <div className="space-y-6">
                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedProfile.displayName}
                                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{editedProfile.displayName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                        <span className="text-gray-900">{user?.email}</span>
                                        {!user?.emailVerified && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedProfile.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900">
                                                {editedProfile.phone || 'Not provided'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedProfile.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your address"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                            <span className="text-gray-900">
                                                {editedProfile.address || 'Not provided'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedProfile.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            placeholder="Tell us about yourself"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{editedProfile.bio}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={handleEditToggle}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Email Verified</span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        user?.emailVerified 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user?.emailVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Account Type</span>
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                        Regular
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Last Login</span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(user?.lastLoginAt || '1751126172438')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    <Key className="w-4 h-4 mr-3" />
                                    Change Password
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    <Shield className="w-4 h-4 mr-3" />
                                    Privacy Settings
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    <Bell className="w-4 h-4 mr-3" />
                                    Notifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;