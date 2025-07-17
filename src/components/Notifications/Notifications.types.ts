export type NotificationType = 'warning' | 'danger' | 'loading';

type Id = string;

export type ItemParams = {
  type?: NotificationType;
  title?: string;
  content?: string;
  autoHide?: boolean;
};

export type Methods = {
  // Show a notification based on the given params.
  //
  // Returns the id of the notification that can be used for close(id) and remove(id) methods.
  show: (data: ItemParams) => Id;
  // Will pause hiding the notification.
  //
  // By default hover on notification item will set to pause.
  pause: () => void;
  // Will resume to the timeouts to hide the notification.
  unpause: () => void;
  // Gracefully hide the notification with an animation.
  close: (id: Id) => void;
  // Immediately remove the notification without any animation.
  remove: (id: Id) => void;
};

export type ItemProps = ItemParams &
  Methods & {
    id: string;
    visible: boolean;
  };
