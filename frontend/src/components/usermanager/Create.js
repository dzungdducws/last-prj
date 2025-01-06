import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      user_id: Math.random().toString(36).substr(2, 9),
      ...formData,
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    router.push('/users');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm người dùng mới</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên
          </label>
          <input
            type="text"
            placeholder="Tên"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
