interface ServerlessRequest {
  method?: string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

export default function handler(_req: ServerlessRequest, res: ServerlessResponse): void {
  res.status(200).json({
    ok: true,
    service: 'MK Man And Van Removals Services Ipswich',
  });
}
