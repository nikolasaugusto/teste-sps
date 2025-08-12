class UserService {
  constructor() {
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        {
          id: '1',
          email: 'admin@sps.com',
          name: 'Admin User',
          type: 'admin',
          password: 'admin123'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }

  async list() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users;
  }

  async get(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === id);
    return user || null;
  }

  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const newUser = {
      id: Date.now().toString(),
      ...data
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return newUser;
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const existingUser = users.find(u => u.email === data.email && u.id !== id);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const updateData = { ...data };
    if (!updateData.password) {
      delete updateData.password;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData
    };

    localStorage.setItem('users', JSON.stringify(users));
    return users[userIndex];
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    if (users[userIndex].email === 'admin@sps.com') {
      throw new Error('Não é possível excluir o usuário administrador');
    }

    users.splice(userIndex, 1);
    localStorage.setItem('users', JSON.stringify(users));

    return true;
  }
}

export default UserService;
