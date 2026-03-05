// Domain Entity: User
// Backend Role enum: admin | customer (lowercase)
export class User {
  constructor({ id, name, email, role, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt || null;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  displayRole() {
    return this.role === 'admin' ? 'Administrator' : 'Customer';
  }

  static fromDTO(dto) {
    return new User({
      id: dto.id,
      name: dto.name,
      email: dto.email,
      role: dto.role,
      createdAt: dto.createdAt || dto.created_at || null,
    });
  }
}
