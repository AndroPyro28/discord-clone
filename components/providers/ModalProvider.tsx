"use client"
import React, { useEffect, useState } from 'react'
import CreateServerModal from '@/components/modals/CreateServerModal'
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import ManageMembersModal from '@/components/modals/ManageMembersModal';
import CreateChannelModal from '../modals/CreateChannelModal';
import LeaveServerModal from '../modals/LeaverServerModal';
import DeleteServerModal from '../modals/DeleteServerModal';

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null
    }

  return (
    < >
        <CreateServerModal />
        <InviteModal />
        <EditServerModal />
        <ManageMembersModal />
        <CreateChannelModal />
        <LeaveServerModal />
        <DeleteServerModal />
    </>
  )
}

export default ModalProvider