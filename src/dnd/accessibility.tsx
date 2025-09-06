import React from 'react'
export function LiveRegion({ message }: { message: string }) { return <div className="live-region" role="status" aria-live="assertive" aria-atomic="true">{message}</div> }
