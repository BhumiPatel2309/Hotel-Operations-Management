const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MONGODB_URI = 'mongodb+srv://22it091:hms@cluster0.ei6qv4i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      email: { type: String, required: true },
      contact: { type: String, required: true },
      role: { type: String, ref: 'Role', required: true },
      created: { type: Date, default: Date.now },
      updated: { type: Date },
      last_login: { type: Date },
      last_deleted: { type: Date },
      status: { type: String, default: 'active' },
      logged_in: { type: Boolean, default: false },
      last_login_ip_address: { type: String },
    });
    
const User = mongoose.model('User', userSchema);

const permissionSchema = new mongoose.Schema({
    title: String,
    code: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
    status: { type: String, default: 'active' }
});

const Permission = mongoose.model('Permission', permissionSchema);

const roleSchema = new mongoose.Schema({
    roleName: String,
    permissions: [String],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
    status: { type: String, default: 'active' }
  });

const Role = mongoose.model('Role', roleSchema);

const roomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true },
  roomType: { type: String, required: true },
  roomStatus: { type: String, required: true, enum: ['available', 'unavailable', 'occupied', 'clean', 'unclean'] },
  carpetArea: { type: Number, required: true }
});

const Room = mongoose.model('Room', roomSchema);

const taskSchema = new mongoose.Schema({
  type_of_task: String,
  title: String,
  description: String,
  created: { type: Date, default: Date.now },
  created_by: String,
  assigned_by: String,
  assigned_to: String,
  task_status: String,
  comments: String,
  room_id: String,
  subtasks: [
    {
        description: String,
    },
]
});

const Task = mongoose.model('Task', taskSchema);

app.get('/', (req, res) => {
    res.send('HMS Server!');
  });

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
      if(password!=user.password)
      {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.send(user);
});

app.post('/api/roles', async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    res.send(role);
  });
  
  app.get('/api/roles', async (req, res) => {
    const roles = await Role.find({ is_deleted: false });
    res.send(roles);
  });
  
  app.put('/api/roles/:id', async (req, res) => {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(role);
  });
  
  app.delete('/api/roles/:id', async (req, res) => {
    await Role.findByIdAndUpdate(req.params.id, { is_deleted: true });
    res.send({ message: 'Role deleted' });
  });

  app.post('/api/permissions', async (req, res) => {
    const { title, code } = req.body;
    const permission = new Permission({ title, code });
    await permission.save();
    res.send(permission);
});

app.get('/api/permissions', async (req, res) => {
    const permissions = await Permission.find({ is_deleted: false });
    res.send(permissions);
});

app.put('/api/permissions/:id', async (req, res) => {
    const { title, code } = req.body;
    const permission = await Permission.findByIdAndUpdate(
        req.params.id,
        { title, code, updated: Date.now() },
        { new: true }
    );
    res.send(permission);
});

app.delete('/api/permissions/:id', async (req, res) => {
    const permission = await Permission.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true });
    res.send(permission);
});

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/api/users', async (req, res) => {
const { name, username, password, email, contact, role } = req.body;
const user = new User({
  name,
  username,
  password,
  email,
  contact,
  role,
});
await user.save();
res.send(user);
});

app.put('/api/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({ message: 'User deleted' });
});

app.post('/api/rooms/add', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).send(newTask);
});

app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.put('/api/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { task_status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { task_status: task_status }, 
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.send(updatedTask);
  } catch (error) {
    res.status(500).send({ message: 'Error updating task', error: error.message });
    console.log(error);
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
