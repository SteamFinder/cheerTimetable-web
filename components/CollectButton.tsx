'use client'
import React, { useCallback, useState, useEffect } from 'react'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { CAN_COLLECT_ROUTES } from '../constants/routes'
import { Course, Subject } from '@prisma/client'
import {
  useCollection,
  useCollectionDispatch,
} from 'contexts/collectionContext'
import { useSelectedLayoutSegments } from 'next/navigation'
import { StarIcon } from '@heroicons/react/24/solid'

type CollectionItem = {
  type: string
  id: string
  label: string
  name: string
}

export const CollectButton = () => {
  const dispatch = useCollectionDispatch()
  const collection = useCollection()
  const segments = useSelectedLayoutSegments()
  // [ 'schedule', 'student/8210221303' ] 为什么会是这样？

  const [collectionItem, setCollectionItem] = useState<CollectionItem | null>(
    null
  )

  useEffect(() => {
    const item: CollectionItem = getType(segments)
    setCollectionItem(item)
  }, [])

  const handleToggle = useCallback(() => {
    dispatch({
      type: 'SET',
      payload: {
        data: collectionItem,
      },
    })
  }, [dispatch, collectionItem])

  const followed = collectionItem
    ? collection[collectionItem.type].find((e) => e.id === collectionItem.id)
    : false

  return (
    <button className="inline-flex items-center" onClick={handleToggle}>
      <div className="mr-2 h-6 w-6 align-middle text-slate-500">
        {followed ? (
          <StarIcon className="h-5 w-5" />
        ) : (
          <StarIconOutline className="h-5 w-5" />
        )}
      </div>
    </button>
  )
}

export default CollectButton

function getType(segments: string[]) {
  let type: string = ''
  let id: string = ''
  if (segments[0] === 'schedule') {
    ;[type, id] = segments[1].split('/')
  }
  return {
    type,
    id,
    label: window ? document.title : '',
    name: '',
  }
}
