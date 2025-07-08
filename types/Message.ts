export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  job_id: string | null;
  content: string;
  created_at: string;
}

export interface MessagePayload {
  sender_id: string;
  receiver_id: string;
  job_id: string | null;
  content: string;
}