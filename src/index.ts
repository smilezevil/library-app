import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

import { LibraryManager } from './services/LibraryManager';
import { NotificationService } from './services/NotificationService';
import { Storage } from './services/Storage';
import { Modal } from './ui/components/Modal';
import { mountApp } from './ui/render';

const notifications = new NotificationService();
notifications.subscribe(({ type, message, buttonText }) => {
  void Modal.alert({ message, buttonText, type });
});

const manager = new LibraryManager(new Storage(), notifications);
mountApp(document.getElementById('app') as HTMLDivElement, manager);
