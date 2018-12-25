import * as grpcWeb from 'grpc-web';
import {
  Empty,
  Freight,
  FreightsReply,
  Price,
  Start} from './freight_pb';

export class FreightsClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  list(
    request: Empty,
    metadata: grpcWeb.Metadata,
    callback: (err: grpcWeb.Error,
               response: FreightsReply) => void
  ): grpcWeb.ClientReadableStream<FreightsReply>;

}

export class FreightsPromiseClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  list(
    request: Empty,
    metadata: grpcWeb.Metadata
  ): Promise<FreightsReply>;

}

